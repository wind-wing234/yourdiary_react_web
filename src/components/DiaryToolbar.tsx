import React, { useState } from 'react';
import { Dayjs } from 'dayjs';
import {
  Stack,
  ButtonGroup,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from '@mui/material';
import { Add, Save, Delete, Sync, Logout } from '@mui/icons-material';
import DiaryCalendar from './DiaryCalendar.tsx';
import { DiaryEntry } from '../diary';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router';

interface DiaryToolbarProps {
  selectedDate: Dayjs | null;
  handleEntrySelect: (entry: DiaryEntry) => void;
  userid: number
  entries: DiaryEntry[];
  onSync: () => void;
  onEditToggle: () => void;
  onSave: () => void;
  isEditMode: boolean;
  onDelete: () => void;
}

const DiaryToolbar: React.FC<DiaryToolbarProps> = ({ 
  selectedDate, 
  handleEntrySelect, 
  userid,
  entries,
  onSync,
  onEditToggle,
  onSave,
  isEditMode,
  onDelete
}) => {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openExitEditConfirm, setOpenExitEditConfirm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    onDelete();
    setOpenDeleteConfirm(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditButtonClick = () => {
    if (isEditMode) {
      setOpenExitEditConfirm(true);
    } else {
      onEditToggle();
    }
  };

  const handleConfirmExitEdit = () => {
    onEditToggle();
    setOpenExitEditConfirm(false);
  };

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        width: 0.22,
        borderLeft: 1,
        borderColor: 'divider',
        p: 2,
        bgcolor: '#ffffff'
      }}
    >
      <DiaryCalendar 
        value={selectedDate}
        handleEntrySelect={handleEntrySelect}
        userid={userid}
        entries={entries}
      />
      <Divider flexItem />
      <ButtonGroup variant="outlined" size="large">

        <IconButton 
          onClick={handleEditButtonClick}
          color={isEditMode ? "primary" : "default"}
        >
          <Add />
        </IconButton>

        <IconButton 
          onClick={onSave}
          disabled={!isEditMode}
        >
          <Save />
        </IconButton>

        <IconButton
          onClick={() => setOpenDeleteConfirm(true)}
        >
          <Delete />
        </IconButton>

        <IconButton onClick={onSync} title='刷新'><Sync /></IconButton>
        
        <IconButton onClick={handleLogout} title='退出登录'>
          <Logout />
        </IconButton>
      </ButtonGroup>

      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除这篇日记吗？此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>取消</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            删除
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openExitEditConfirm}
        onClose={() => setOpenExitEditConfirm(false)}
      >
        <DialogTitle>确认退出编辑</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要退出编辑模式吗？未保存的更改将会丢失。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitEditConfirm(false)}>继续编辑</Button>
          <Button onClick={handleConfirmExitEdit} color="warning" autoFocus>
            退出编辑
          </Button>
        </DialogActions>
      </Dialog>

    </Stack>
  );
};

export default DiaryToolbar;
