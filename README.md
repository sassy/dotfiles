# dotfiles
- dotfilesはchezmoiで管理する
- https://github.com/twpayne/chezmoi

## chezmoi設定方法
```bash
$ brew install chezmoi
$ chezmoi init git@github.com:sassy/dotfiles.git
$ chezmoi apply
```

## chezmoiでgitの変更を反映
```bash
$ chezmoi cd
$ git pull
$ chezmoi apply
```