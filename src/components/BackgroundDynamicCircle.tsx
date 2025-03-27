import React, { useEffect, useRef, ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface BackgroundDynamicCircleProps {
  children: ReactNode;
  justifyContent?: string;
  alignItems?: string;
  sx?: SxProps<Theme>;
  blueCircles?: number;
  pinkCircles?: number;
}

/**
 * 动态圆形背景布局组件
 * @param children 子组件
 * @param justifyContent 水平对齐方式，默认为 'center'
 * @param alignItems 垂直对齐方式，默认为 'center'
 * @param sx 其他样式属性
 * @param blueCircles 蓝色圆形的数量
 * @param pinkCircles 粉色圆形的数量
 */
const BackgroundDynamicCircle: React.FC<BackgroundDynamicCircleProps> = ({
  children,
  justifyContent = 'center',
  alignItems = 'center',
  sx = {},
  blueCircles = 6,
  pinkCircles = 3
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布大小为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 颜色定义
    const backgroundColor = '#f7f5f0'; // 米白色背景
    const blueColor = '#4987b6'; // 墨蓝
    const pinkColor = '#ff6e71'; // 洋粉红
    
    // 创建浮动圆形
    class Circle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      pulseTime: number;
      initialSize: number;

      constructor(isBlue: boolean) {
        // 更分散的初始位置
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // 圆形大小控制，避免过大导致重叠
        this.size = Math.random() * 60 + 30;
        this.color = isBlue ? blueColor : pinkColor;
        
        // 减慢移动速度
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        
        // 略微增加透明度
        this.opacity = Math.random() * 0.3 + 0.06;
        
        // 添加轻微的脉动效果
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseTime = Math.random() * 100;
        this.initialSize = this.size;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检查 - 碰到边界反弹
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        // 轻微脉动效果
        this.pulseTime += this.pulseSpeed;
        const pulseFactor = Math.sin(this.pulseTime) * 0.1 + 1;
        this.size = this.initialSize * pulseFactor;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }
    
    // 创建圆形数组
    let circles = [];
    
    for (let i = 0; i < blueCircles; i++) {
      circles.push(new Circle(true));
    }
    
    for (let i = 0; i < pinkCircles; i++) {
      circles.push(new Circle(false));
    }
    
    // 动画循环
    const animate = () => {
      // 绘制米白色背景
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制所有圆形
      circles.forEach(circle => {
        circle.update();
        circle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [blueCircles, pinkCircles]);
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems,
        justifyContent,
        padding: 3,
        ...sx,
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      {children}
    </Box>
  );
};

export default BackgroundDynamicCircle;
