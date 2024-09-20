封存！以后使用鑫安利的git库进行开发


鑫安利产品分支，
从对接鑫安利服务器api开始，开始进行分支处理
main分支作为曲镜产品。暂时不继续进行开发


安装一下目录添加文件和文件夹

├── /node_modules/           # 存放项目依赖的第三方库
├── /public/                  # 存放静态资源，如index.html等，这些资源会被直接复制到输出目录（dist）下
│   └── index.html
├── /src/                     # 存放项目的源代码
│   ├── /assets/              # 存放静态资源文件，如图片、字体等
│   ├── /components/          # 存放Vue组件
│   ├── /composables/         # 存放Vue 3的组合式API函数（可选）
│   ├── /layout/              # 存放页面布局模板（可选）
│   ├── /plugins/             # 存放Vue插件（可选）
│   ├── /router/              # 存放Vue Router相关的路由配置
│   │   └── index.ts
│   ├── /store/               # 存放Vuex状态管理相关的代码
│   │   └── index.ts
│   ├── /styles/              # 存放样式文件，如全局样式表
│   │   └── index.scss
│   ├── /utils/               # 存放工具模块（可选）
│   ├── /views/                # 存放路由页面组件
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件，用于创建Vue应用实例
│   ├── shims-vue.d.ts        # 用于补充.vue模块的类型声明
│   └── vite-env.d.ts         # 用于补充Vite的类型声明
├── /.gitignore               # Git忽略文件
├── /README.md                # 项目说明文件
├── /index.html               # 入口HTML文件（通常与public下的index.html相同，但根据项目配置可能不同）
├── /package-lock.json        # 锁定安装时的包的版本号，确保项目依赖的一致性
├── /package.json             # 项目的配置文件和依赖列表
├── /tsconfig.json            # TypeScript编译器的配置文件
└── /vite.config.ts           # Vite项目的配置文件
