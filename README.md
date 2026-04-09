# 留言墙（Note Wall）

一个轻量级的在线留言墙应用，用户可以匿名或署名发布留言，所有留言以卡片墙形式展示。

## 技术栈

- **前端框架**：Next.js 15 + TypeScript
- **样式方案**：Tailwind CSS v4
- **数据库**：Supabase（PostgreSQL）
- **测试框架**：Vitest + React Testing Library
- **部署托管**：Vercel

## 功能特性

- 📝 匿名/署名发布留言
- 📱 响应式布局，适配桌面和移动端
- ❤️ 点赞功能（防重复点赞）
- 🔄 分页加载更多
- 🎨 随机头像生成
- 📌 置顶留言支持

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/gqy20/note_wall.git
cd note_wall
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入 Supabase 凭据：

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 初始化数据库

在 Supabase SQL Editor 中执行 `supabase/migrations/001_create_messages_table.sql`，或使用 CLI：

```bash
supabase link --project-ref your_project_ref
supabase db push
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

## 测试

```bash
# 运行测试
npm test

# 单次运行
npm run test:run
```

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`）
4. 自动构建部署

或使用 CLI：

```bash
vercel
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── globals.css         # 全局样式
├── components/             # UI 组件
│   ├── MessageWall.tsx     # 留言墙主组件
│   ├── MessageCard.tsx     # 留言卡片
│   └── MessageForm.tsx     # 发布表单
├── services/
│   └── messageService.ts   # Supabase 数据服务
├── lib/
│   └── supabase.ts         # Supabase 客户端
├── types/
│   └── message.ts          # 类型定义
└── __tests__/              # 测试文件
    ├── services/           # 服务层测试
    └── components/         # 组件测试
```

## License

MIT
