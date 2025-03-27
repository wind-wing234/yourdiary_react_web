import React, { ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface BackgroundImageLayoutProps {
  backgroundImage: string;
  children: ReactNode;
  justifyContent?: string;
  alignItems?: string;
  sx?: SxProps<Theme>;
}

/**
 * 背景图像布局组件
 * @param backgroundImage 背景图像路径
 * @param children 子组件
 * @param justifyContent 水平对齐方式，默认为 'flex-end'
 * @param alignItems 垂直对齐方式，默认为 'center'
 * @param sx 其他样式属性
 */
const BackgroundImageLayout: React.FC<BackgroundImageLayoutProps> = ({
  backgroundImage,
  children,
  justifyContent = 'flex-end',
  alignItems = 'center',
  sx = {},
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        minHeight: '100vh',
        position: 'absolute',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems,
        justifyContent,
        padding: 3,
        overflow: 'visible',
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default BackgroundImageLayout;
