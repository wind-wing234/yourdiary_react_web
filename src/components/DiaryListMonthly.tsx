import React, { memo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { DiaryEntry, DiaryListMonthlyProps} from '../diary';
import dayjs from 'dayjs';

const getYearMonthString = (yearMonth: string) => {
  // const [year, month] = yearMonth.split('-').map(Number);
  // const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  // return `${year}.${months[month - 1]}月`;
  return dayjs(`${yearMonth}-1`).format(`YYYY.MM`);
};

interface DiaryCardProps {
  entry: DiaryEntry;
  onClick?: () => void;
}

const DiartCard: React.FC<DiaryCardProps> = memo(({ entry, onClick }) => {
  const textColor = entry.entryType === 'self' ? '#528CB6' : '#FF7074';
  // TODO: 女方视角的颜色主题
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: 'action.hover',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{
        pl: 1.5,
        display: 'flex',
        gap: 1,
        alignItems: 'center'
      }}>

        {/* 左侧日期、星期部分 */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '60px',
          lineHeight: 1
        }}>
          <Typography variant="h4" sx={{
            lineHeight: 1,
            color: textColor
          }}>
            {new Date(entry.createddate).getDate()}
          </Typography>
          <Typography variant="caption" sx={{
            color: textColor
          }}>
            {['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][new Date(entry.createddate).getDay()]}
          </Typography>
        </Box>

        {/* 右侧时间、标题、内容部分 */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography variant="caption" display="block" sx={{
            color: textColor
          }}>
            {new Date(entry.ts * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography variant="subtitle1" sx={{
            color: textColor
          }} noWrap>
            {entry.title? entry.title : entry.createddate}
          </Typography>
          <Typography variant="body2" sx={{
            color: textColor
          }} noWrap>
            {entry.content}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

const DiaryListMonthly: React.FC<DiaryListMonthlyProps> = memo(({ month, entries, onDateSelect }) => {
  return (
    <Box>

      {/* 年月标题 */}
      <Typography variant="subtitle1" sx={{
        mb: 1,
        fontWeight: 600,
        color: '#303030'
      }}>
        {getYearMonthString(month)}
      </Typography>

      <Stack spacing={1}>
        {/* 日记条目 */}
        {entries.map(entry => (
          <DiartCard 
            key={`${entry.createddate}-${entry.id}`} 
            entry={entry} 
            onClick={() => onDateSelect(entry)}
          />
        ))}
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
});

export default DiaryListMonthly;
