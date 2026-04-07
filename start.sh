#!/bin/bash

# 云轩阁启动脚本 (Ubuntu)
# 默认端口: 3000 (避免与 5000/5173 冲突)

set -e

echo "=========================================="
echo "     云轩阁 - 启动脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装${NC}"
    echo "请先安装 Node.js 18.0 或更高版本"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}错误: Node.js 版本过低 (需要 >= 18)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: npm 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm 版本: $(npm -v)${NC}"

# 安装依赖
echo ""
echo "正在安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
else
    echo -e "${YELLOW}⚠ node_modules 已存在，跳过安装${NC}"
    echo "如需重新安装，请运行: rm -rf node_modules && npm install"
fi

# 设置端口 (默认 3000)
PORT=${PORT:-3000}

# 检查端口是否被占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ 端口 $PORT 已被占用${NC}"
    # 尝试其他端口
    for alt_port in 3001 3002 3003 8080 8081; do
        if ! lsof -Pi :$alt_port -sTCP:LISTEN -t >/dev/null 2>&1; then
            PORT=$alt_port
            echo -e "${GREEN}✓ 自动切换到可用端口: $PORT${NC}"
            break
        fi
    done
fi

echo ""
echo "=========================================="
echo "     启动开发服务器"
echo "=========================================="
echo -e "${GREEN}应用将在 http://localhost:$PORT 运行${NC}"
echo ""

# 启动开发服务器
npm run dev -- --port $PORT
