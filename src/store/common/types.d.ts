export interface CommonInitialState {
  toast: {
    show: boolean;
    message: string;
    duration: number;
    type: 'success' | 'error';
  };
  modal: {
    createActor: boolean;
    createProducer: boolean;
  };
}
