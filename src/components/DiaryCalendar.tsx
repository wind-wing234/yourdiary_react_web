import React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/zh-cn';
import { Dayjs } from 'dayjs';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DiaryEntry } from '../diary';
import { Menu, MenuItem } from '@mui/material';

interface DiaryCalendarProps {
  value: Dayjs | null;
  handleEntrySelect: (entry: DiaryEntry) => void;
  userid: number;
  entries: DiaryEntry[];
  displayMode?: 'dots' | 'lines';
}

const DiaryCalendar: React.FC<DiaryCalendarProps> = ({
  value,
  handleEntrySelect,
  userid,
  entries,
  displayMode = 'dots'
}) => {

  // 要显示menu的元素
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  // 暂存对应日期的条目
  const [menuEntries, setMenuEntries] = React.useState<DiaryEntry[]>([]);

  const dayRef = React.useRef<HTMLDivElement>(null);

  const handleDateClick = (date: Dayjs, element: HTMLElement) => {
    // 1.寻找当前日期下有多少日记
    const dateStr = date.format('YYYY-MM-DD');
    const entriesOnDate = entries.filter(entry => entry.createddate === dateStr);

    // 2.如果没有日记，新建一个
    if (entriesOnDate.length === 0) {
      handleEntrySelect({
        id: -1,
        createddate: dateStr,
        createdtime: 0,
        ts: 0,
        title: '',
        content: '',
        msg_count: 0,
        mood: '',
        space: '',
        weather: '',
        user: userid,
        entryType: 'self'
      } as DiaryEntry);
      return;

      // 3.如果有一条日记，直接选择该条
    } else if (entriesOnDate.length === 1) {
      handleEntrySelect(entriesOnDate[0]);
      return;

      // 4.如果有多条日记，弹出选择框
    } else {
      console.log(element);
      setMenuAnchorEl(element);
      console.log(menuAnchorEl);
      setMenuEntries(entriesOnDate);
      return;
    }
  };

  const handleMenuItemClick = (entry: DiaryEntry) => {
    handleEntrySelect(entry);
    setMenuAnchorEl(null);
  };

  // 检查某个日期是否存在自己或者对方的日记
  const hasEntry = (date: Dayjs): String => {
    const dateStr = date.format('YYYY-MM-DD');
    const types = entries
      .filter(entry => entry.createddate === dateStr)
      .map(entry => entry.entryType);

    if (types.includes('self') && types.includes('paired')) return 'both';
    if (types.includes('self')) return 'self';
    if (types.includes('paired')) return 'paired';
    return '';
  };

  // 点状样式配置
  const dotStyles = {
    position: 'absolute',
    bottom: '2px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  };

  // 横线样式配置
  const lineStyles = {
    position: 'absolute',
    bottom: '2px',
    height: '2px',
    width: '50%',
    left: '25%',
  };

  // 自定义日期渲染
  const CustomDay = (props: PickersDayProps<Dayjs>) => {
    const { day, ...other } = props;
    const hasEntryOnDay = hasEntry(day);

    // 点状显示样式
    const dotStyleProps = {
      '&::before': hasEntryOnDay === 'both' || hasEntryOnDay === 'self' ? {
        ...dotStyles,
        content: '""',
        left: hasEntryOnDay === 'both' ? 'calc(50% - 5px)' : '50%',
        transform: hasEntryOnDay === 'both' ? 'none' : 'translateX(-50%)',
        backgroundColor: '#528CB6'
      } : {},
      '&::after': hasEntryOnDay === 'both' || hasEntryOnDay === 'paired' ? {
        ...dotStyles,
        content: '""',
        right: hasEntryOnDay === 'both' ? 'calc(50% - 5px)' : '50%',
        transform: hasEntryOnDay === 'both' ? 'none' : 'translateX(50%)',
        backgroundColor: '#FF7074'
      } : {}
    };

    // 横线显示样式
    const lineStyleProps = {
      '&::before': hasEntryOnDay ? {
        ...lineStyles,
        content: '""',
        background: hasEntryOnDay === 'both'
          ? 'linear-gradient(to right, #528CB6 50%, #FF7074 50%)'
          : hasEntryOnDay === 'self'
            ? '#528CB6'
            : '#FF7074'
      } : {}
    };

    return (
      <PickersDay
        {...other}
        day={day}
        onClick={() => {
          handleDateClick(day, dayRef.current as HTMLElement);
          // other.onClick?.(event);  // 保留原有的点击行为
        }}
        sx={{
          ...other.sx,
          position: 'relative',
          ...(displayMode === 'dots' ? dotStyleProps : lineStyleProps)
        }}
      />

    );
  };

  return (
    // TODO: 这个ref决定了menu的位置，照理说应该放在选中的日期旁边
    // 但是pickerday貌似无法选中，就很奇怪。暂时放在这
    <div ref={dayRef}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='zh-cn'>
        <DateCalendar
          value={value}
          slots={{
            day: CustomDay
          }}
          sx={{
            width: '100%',
            '& .MuiPickersDay-root': {
              fontSize: '0.875rem'
            },
            '& .MuiPickersDay-root.Mui-selected': {
              backgroundColor: '#528CB6'
            }
          }}
        />
      </LocalizationProvider>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {menuEntries.map((entry) => (
          <MenuItem
            key={entry.id}
            onClick={() => handleMenuItemClick(entry)}
            sx={{
              color: entry.entryType === 'self' ? '#528CB6' : '#FF7074'
            }}
          >
            {entry.entryType === 'self' ? 'My Diary' : 'Your Diary'}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DiaryCalendar;
