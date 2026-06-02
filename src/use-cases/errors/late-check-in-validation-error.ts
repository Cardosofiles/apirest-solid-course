export class LateCheckInValidationError extends Error {
  constructor() {
    super('O check-in só poderá ser validado até 20 minutos após a sua criação.');
  }
}
