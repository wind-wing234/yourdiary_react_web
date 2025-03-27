import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Divider,
  Typography,
  CircularProgress
} from '@mui/material';
import { DiaryEntry } from '../diary';
import dayjs from 'dayjs';

interface DiaryEditorProps {
  selectedEntry: DiaryEntry;
  isEditMode: boolean;
  handleSave: (entry: DiaryEntry, changeMode?: boolean) => void;
  isSaving: boolean;
  isLoading: boolean;
}

// 辅助函数：计算并格式化时间差
const formatTimeAgo = (timestamp: number | null): string => {
  if (timestamp === null) return "NULL";
  const now = dayjs();
  const readTime = dayjs(timestamp * 1000); // 转换为毫秒
  const diffSeconds = now.diff(readTime, 'second');
  const diffMinutes = now.diff(readTime, 'minute');
  const diffHours = now.diff(readTime, 'hour');
  const diffDays = now.diff(readTime, 'day');
  const diffMonths = now.diff(readTime, 'month');
  const diffYears = now.diff(readTime, 'year');
  // console.log(timestamp, now);
  // console.log(diffSeconds, diffMinutes, diffHours, diffDays, diffMonths, diffYears);

  if (diffYears > 0) return `${diffYears}年`;
  if (diffMonths > 0) return `${diffMonths}个月`;
  if (diffDays > 0) return `${diffDays}天`;
  if (diffHours > 0) return `${diffHours}小时`;
  if (diffMinutes > 0) return `${diffMinutes}分钟`;
  return `${diffSeconds}秒`;
};

const DiaryEditor: React.FC<DiaryEditorProps> = ({ selectedEntry, isEditMode, handleSave, isSaving, isLoading }) => {
  // 状态：暂存当前编辑的日记条目
  const [localEntry, setLocalEntry] = useState<DiaryEntry>(selectedEntry);

  useEffect(() => {
    if (!isEditMode) {
      // 当退出编辑模式时，重置/刷新 localEntry
      setLocalEntry(selectedEntry);
    }
  }, [isEditMode, selectedEntry]);

  useEffect(() => {
    if (isSaving) {
      handleSave(localEntry);
    }
  }, [isSaving]);

  // 文本插入函数
  const insertTextAtCursor = (
    event: React.KeyboardEvent<HTMLDivElement>,
    textToInsert: string
  ): void => {
    // 阻止默认行为
    event.preventDefault();

    // 获取目标元素和光标位置
    const target = event.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    // 创建新的内容
    const newContent =
      localEntry.content.substring(0, start) +
      textToInsert +
      localEntry.content.substring(end);

    // 更新条目内容
    setLocalEntry({
      ...localEntry,
      content: newContent
    });

    // 在DOM更新后再设置新的光标位置
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + textToInsert.length;
    }, 0);
  };

  // 计算内容字数（去除空格和换行）
  const countCharacters = (text: string): number => {
    return text.replace(/\s+/g, '').length;
  };

  // 字数统计
  const characterCount = countCharacters(localEntry.content);

  // 决定是否显示字数统计
  const showCharacterCount = !isEditMode && characterCount > 0;

  // 决定是否显示阅读时间信息
  const showReadMark = showCharacterCount &&
    selectedEntry.entryType === 'self' &&
    selectedEntry.read_mark !== undefined;

  // 格式化阅读时间信息
  const readMarkText = showReadMark
    ? `TA 在 ${formatTimeAgo(selectedEntry.read_mark ?? null)}前 看了这篇日记`
    : '';

  // 处理按键事件
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isEditMode) return;

    // Tab 键处理 - 插入空格
    if (event.key === 'Tab') {
      insertTextAtCursor(event, '        ');
    }

    // Ctrl+D 键处理 - 插入时间条
    else if (event.key === 'd' && event.ctrlKey) {
      const currentTime = dayjs().format('HH:mm:ss');
      const timeStamp = `\n\n[${currentTime}]\n`;
      insertTextAtCursor(event, timeStamp);
    }

    // Ctrl+S 键处理 - 保存但不切换模式
    else if (event.key === 's' && event.ctrlKey) {
      event.preventDefault();
      handleSave(localEntry, false);
    }
  };

  return (
    <Box sx={{
      flexGrow: 1,
      p: 3
    }}>
      <Paper
        sx={{
          p: 2,
          height: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TextField
          fullWidth
          multiline
          variant="standard"
          placeholder="标题"
          value={localEntry.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalEntry({
              ...localEntry,
              title: event.target.value
            });
          }}
          slotProps={{
            input: {
              readOnly: !isEditMode,
              disableUnderline: true,
              style: {
                fontSize: '24px',
                fontWeight: 'bold'
              }
            }
          }}
          sx={{ mb: 2 }}
        />
        <Divider sx={{ mb: 2 }} />

        {/* 内容区域包装器 - 包含文本输入和字数统计 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '0.5rem'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'transparent',
              borderRadius: '0.5rem'
            },
            '&:hover::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <CircularProgress disableShrink />
            </Box>
          ) : (
            <TextField
              fullWidth
              multiline
              variant="standard"
              placeholder="开始写作..."
              value={localEntry.content}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLocalEntry({
                  ...localEntry,
                  content: event.target.value
                });
              }}
              onKeyDown={handleKeyDown}
              slotProps={{
                input: {
                  readOnly: !isEditMode,
                  disableUnderline: true
                }
              }}
              sx={{
                mb: 4,
                flex: 'none',
                '& .MuiInputBase-root': {
                  alignItems: 'flex-start'
                }
              }}
            />
          )}

          {/* 在非编辑模式但有内容时显示字数统计和阅读信息 */}
          {showCharacterCount && !isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 'auto'
              }}>
              <Typography
                variant="caption"
                color='textSecondary'
              >
                {showReadMark && (
                  <>
                    {readMarkText} | {' '}
                  </>
                )}
                {characterCount} 字
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DiaryEditor;
