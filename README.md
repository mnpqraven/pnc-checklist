# Tauri + Next.js + Typescript

This template should help get you started developing with Tauri, Next.js and Typescript.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Frontend
```
/              // index page
/doll_list     // list of units, can add/remove units, modify info
/general_resource // general resource page
/eval_summary  // summary of resource needed
/algo_suggest  // (TBD) select a newly dropped algo and then shows which doll need that piece, or reconfigure
```

## Backend
- Rust backend, pipes data to frontend using tauri's `invoke()`
