# Lines configured by zsh-newuser-install
HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000
bindkey -e
# End of lines configured by zsh-newuser-install
# The following lines were added by compinstall
zstyle :compinstall filename '/Users/sassy/.zshrc'

autoload -Uz compinit
compinit
# End of lines added by compinstall

PROMPT='[%n %d]$ '
export MAILCHECK=0

export EDITOR=vi
eval "$(direnv hook zsh)"

export PATH="$HOME/bin:$PATH"

if [ -d $HOME/.anyenv ] ; then
  export PATH="$HOME/.anyenv/bin:$PATH"
  eval "$(anyenv init -)"
fi

# OPAM configuration
. /Users/sassy/.opam/opam-init/init.zsh > /dev/null 2> /dev/null || true
export PATH="/usr/local/opt/gettext/bin:$PATH"

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

export PATH="/usr/local/opt/libressl/bin:$PATH"
export PATH="/usr/local/opt/openssl/bin:$PATH"

export ANDROID_HOME="/Users/sassy/Library/Android/sdk"
export ANDROID_SDK_ROOT="/Users/sassy/Library/Android/sdk"
export ANDROID_AVD_HOME="/Users/sassy/.android/avd"

eval "$(rbenv init -)"
eval "$(nodenv init -)"
export PATH="/usr/local/opt/openjdk/bin:$PATH"

