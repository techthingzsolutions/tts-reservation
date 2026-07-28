/**
 * Normalised API error. Every failed request rejects with one of these, so
 * components never have to poke at `error.response.data` shapes.
 */
export class ApiError extends Error {
  constructor({ message, status, code, errors = {}, original }) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? 0;
    this.code = code ?? null;
    /** Field-level validation errors, Laravel shape: { field: [msg, ...] } */
    this.errors = errors;
    this.original = original;
  }

  /** Laravel 422 - form validation failed. */
  get isValidation() {
    return this.status === 422;
  }

  /** Not signed in / token expired. */
  get isUnauthorized() {
    return this.status === 401;
  }

  /**
   * 409 - the slot was taken between the availability query and the booking
   * request. This is the expected failure mode, not an edge case
   * (blueprint 5.3, Layer 3). Never surface it as a generic error.
   */
  get isSlotConflict() {
    return this.status === 409;
  }

  get isNetwork() {
    return this.status === 0;
  }

  /** First validation message for a field, if any. */
  fieldError(field) {
    const messages = this.errors?.[field];
    return Array.isArray(messages) ? messages[0] : messages;
  }
}

export const CONFLICT_MESSAGE =
  'Sorry, that time was just booked by someone else. We refreshed the available times — please pick another.';
