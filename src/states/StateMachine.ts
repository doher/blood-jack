interface IState {
  enter(): () => void;
  update(): () => void;
  exit(): () => void;
}
