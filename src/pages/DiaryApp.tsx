// DiaryApp.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { OriginaDiaryEntry, DiaryEntry } from '../diary';
import dayjs, { Dayjs } from 'dayjs';
import { sync } from '../api/sync.ts';
import { getDiaryByID, updateReadMark } from '../api/getDiary.ts';
import { writeDiary } from '../api/writeDiary.ts';
import { deleteDiary } from '../api/delete.ts';

import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router';

import DiaryListMonthly from '../components/DiaryListMonthly.tsx';
import DiaryEditor from '../components/DiaryEditor.tsx';
import DiaryToolbar from '../components/DiaryToolbar.tsx';

const DiaryApp = () => {

  // --- token管理 ---
  const { token, userid, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');  // 如果未认证，重定向到登录页面
    } else {
      handleSync();   // 如果已认证，同步数据
    }
  }, [isAuthenticated, navigate]);

  // --- Snackbar ---
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // 辅助函数：显示提示信息
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // --- 日记条目管理 ---

  // 状态：编辑模式和预览模式切换
  const [isEditMode, setIsEditMode] = useState(false);

  // 状态：是否正在保存
  const [isSaving, setIsSaving] = useState(false);

  // 状态：存储日记条目内容
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const findEntryByDate = (date: Dayjs, type?: 'self' | 'paired'): DiaryEntry => {
    const dateStr = date.format('YYYY-MM-DD');
    let existingEntry: DiaryEntry | null = null;

    if (type) {
      // 如果提供了类型，按日期和类型查找
      existingEntry = diaryEntries.find(e => e.createddate === dateStr && e.entryType === type) || null;
    } else {
      // 没有提供类型，先找到谁就返回谁
      existingEntry = diaryEntries.find(e => e.createddate === dateStr) || null;
    }

    if (existingEntry) {
      return existingEntry;
    } else {
      // 创建新条目
      return {
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
        entryType: 'self' // 理论上没法创建paired日记
      } as DiaryEntry;
    };
  };

  // 状态：选中的日记条目
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry>(findEntryByDate(dayjs()));

  // 派生状态：选中的日记条目的日期
  const selectedDate = dayjs(selectedEntry.createddate);

  // 状态：是否正在加载日记
  const [isLoading, setIsLoading] = useState(false);

  // 添加同步处理函数
  const handleSync = async () => {
    try {
      const response = await sync(token);
      const selfEntries: DiaryEntry[] = response.diaries.map((entry: OriginaDiaryEntry) => ({
        ...entry,
        entryType: 'self',
        read_mark: response.read_marks[entry.id.toString()] || undefined // 从read_marks中获取对方的阅读时间戳
      }));
      const pairedEntries: DiaryEntry[] = response.diaries_paired.map((entry: OriginaDiaryEntry) => ({
        ...entry,
        entryType: 'paired',
        read_mark: response.own_read_marks[entry.id.toString()] || undefined
      }));

      const allEntries = [...selfEntries, ...pairedEntries].sort((a, b) => dayjs(b.createddate).diff(dayjs(a.createddate)));

      setDiaryEntries(allEntries);

      
      showSnackbar('日记同步成功', 'success');

    } catch (error) {
      console.error('同步失败:', error);
      
      showSnackbar('日记同步失败', 'error');
    }
  };

  // 处理条目选择
  const handleEntrySelect = async (entry: DiaryEntry) => {
    // 编辑模式下禁止切换条目
    if (!isEditMode) {
      if (entry.id > 0) {
        // 已有条目，加载完整内容
        setIsLoading(true); // 开始加载
        try {
          const full_entry = await getDiaryByID(token, entry);
          const updated_entries = diaryEntries.map(e => e.id === entry.id ? full_entry : e);
          setDiaryEntries(updated_entries);
          // 等待加载的时间没能及时给用户反馈，如何解决
          // TODO: 抖动消除的预加载
          updateReadMark(token, entry.id);
          setSelectedEntry(full_entry);
        } catch (error) {
          console.error('加载日记失败:', error);
          
          showSnackbar('加载日记失败', 'error');
        } finally {
          setIsLoading(false); // 结束加载
        }
      } else {
        // 新条目，直接选择
        setSelectedEntry(entry);
      }
    }
  }

  // 切换编辑模式和浏览模式
  const handleAddOrEdit = () => {
    if (isEditMode) {
      // 如果在编辑模式下点击，则放弃保存，切换到浏览模式
      setIsEditMode(false);
      // TODO: 可以添加选项，是否放弃保存

    } else {
      // 如果在浏览模式下点击，则切换到编辑模式
      if (selectedEntry.entryType === 'paired') {
        // 对方日记不允许编辑, 点击编辑后切换到自己的日记
        handleEntrySelect(findEntryByDate(selectedDate, 'self'));
      }
      setIsEditMode(true);

      
      showSnackbar('已进入编辑模式', 'info');
    }
  };

  const handleSaveButton = () => {
    if (isEditMode) {
      setIsSaving(true);
    }
  };

  // 保存修改
  const handleSave = async (entry: DiaryEntry, changeMode: boolean = true) => {
    if (isEditMode) {
      try {
        const returnedEntry = await writeDiary(token, entry);
        var savedEntry = await getDiaryByID(token, returnedEntry);
        savedEntry.entryType = entry.entryType;

        setDiaryEntries(prev => {
          const index = prev.findIndex(e => e.id === savedEntry.id);
          if (index === -1) {
            // 这是新条目，寻找按时间降序的插入位置
            const insertIndex = prev.findIndex(e => dayjs(e.createddate).isBefore(dayjs(savedEntry.createddate)));
            if (insertIndex === -1) {
              // 如果没有更早的条目，插入到末尾
              return [...prev, savedEntry];
            }
            return [
              ...prev.slice(0, insertIndex),
              savedEntry,
              ...prev.slice(insertIndex)
            ];
          }
          // 这是已有条目，替换原有条目
          return prev.map(e => e.id === savedEntry.id ? savedEntry : e);
        });

        if (changeMode) {
          // 如果保存成功，切换回浏览模式
          setIsEditMode(false);
        }
        
        showSnackbar('保存成功', 'success');

      } catch (error) {
        console.error('保存日记失败:', error);
        
        showSnackbar('保存失败', 'error');

      } finally {
        setIsSaving(false);
      }
    }
  };

  // 删除操作
  const handleDelete = async () => {
    if (selectedEntry && selectedEntry.id > 0 && selectedEntry.entryType === 'self') {
      try {
        await deleteDiary(token, selectedEntry.id);
        setDiaryEntries(prev => prev.filter(entry => entry.id !== selectedEntry.id));
        setSelectedEntry(findEntryByDate(dayjs())); // 删除后跳转到当前日期
        
        showSnackbar('删除成功', 'success');

      } catch (error) {
        console.error('删除日记失败:', error);
        
        showSnackbar('删除失败', 'error');
      }

    } else if (selectedEntry.entryType === 'paired') {
      
      showSnackbar('无法抹去对方的记忆', 'warning');
    }
  };

  // 将日记按年月分组，并按时间倒序排列
  const groupByYearMonth = (entries: DiaryEntry[]) => {
    const groups: { [yearMonth: string]: DiaryEntry[] } = {};

    // 生成按年月分组的groups
    entries.forEach(entry => {
      const date = dayjs(entry.createddate);
      const yearMonth = date.format('YYYY-MM'); // 格式化日期
      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(entry);
    });

    // 比较日期
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const dateA = dayjs(a + '-1'); // 添加日期以创建完整日期
      const dateB = dayjs(b + '-1');
      return dateB.diff(dateA); // 使用 diff 进行比较
    });

    return sortedKeys.reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {} as { [yearMonth: string]: DiaryEntry[] });
  };

  // 只有当diaryEntries变化时，才重新计算，单纯切换日期就不用计算了
  const groupedEntries = useMemo(() => {
    return groupByYearMonth(diaryEntries);
  }, [diaryEntries]);

  return (
    <Stack direction="row" sx={{ minHeight: '100vh' }}>
      {/* 左侧列表 */}
      <Box
        sx={{
          width: 0.20,
          height: '95vh',  // 设置固定高度
          overflow: 'hidden',  // 防止 Box 本身滚动
          bgcolor: '#f5f5f5',
          p: 2,
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',  // 使用 flex 布局
          flexDirection: 'column'  // 垂直排列
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>你的日记 - Web</Typography>

        <Stack
          spacing={3}
          sx={{
            overflowY: 'auto',  // 启用垂直滚动
            flex: 1,  // 占满剩余空间
            // TODO：统一全局滚动条样式
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }
            }
          }}
        >
          {Object.entries(groupedEntries).map(([yearMonth, monthEntries]) => (
            <DiaryListMonthly
              key={yearMonth}
              month={yearMonth}
              entries={monthEntries}
              onDateSelect={handleEntrySelect}
            />
          ))}
        </Stack>

      </Box>

      <DiaryEditor
        selectedEntry={selectedEntry}
        isEditMode={isEditMode}
        handleSave={handleSave}
        isSaving={isSaving}
        isLoading={isLoading}
        key={`${selectedEntry.createddate}-${selectedEntry.id}`}
      />
      <DiaryToolbar
        selectedDate={selectedDate}
        handleEntrySelect={handleEntrySelect}
        userid={userid || 0}
        entries={diaryEntries}
        onSync={handleSync}
        onEditToggle={handleAddOrEdit}
        onSave={handleSaveButton}
        isEditMode={isEditMode}
        onDelete={handleDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Stack>
  );
};

export default DiaryApp;