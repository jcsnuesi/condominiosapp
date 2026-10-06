import { Directive, ElementRef, Input, Renderer2, forwardRef, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

export function normalizePhone(value: string): string {
  return (value.trimStart().startsWith('+') ? '+' : '') + value.replace(/\D/g, '');
}

export function formatPhone(value: string): string {
  const normalized = normalizePhone(value);
  const prefix = normalized.startsWith('+') ? '+' : '';
  const digits = normalized.replace(/\D/g, '');
  // Local numbers use 3-3-4; longer numbers retain their country prefix.
  const countryLength = Math.max(0, digits.length - 10);
  const local = digits.slice(countryLength);
  const groups = [local.slice(0, 3), local.slice(3, 6), local.slice(6)];
  if (countryLength) groups.unshift(digits.slice(0, countryLength));
  return prefix + groups.filter(Boolean).join('-');
}

@Directive({
  selector: 'input[appPhoneFormat]',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneFormatDirective), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => PhoneFormatDirective), multi: true },
  ],
  host: {
    type: 'tel',
    inputmode: 'tel',
    '(input)': 'handleInput($event)',
    '(beforeinput)': 'handleBeforeInput($event)',
    '(compositionend)': 'handleInput($event)',
    '(blur)': 'onTouched()',
  },
})
export class PhoneFormatDirective implements ControlValueAccessor, Validator {
  @Input() appPhoneMaxDigits = 16;

  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null | undefined): void {
    this.renderer.setProperty(this.element.nativeElement, 'value', formatPhone(value ?? ''));
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void {
    this.renderer.setProperty(this.element.nativeElement, 'disabled', disabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const length = String(control.value ?? '').replace(/\D/g, '').length;
    return length > this.appPhoneMaxDigits
      ? { maxlength: { requiredLength: this.appPhoneMaxDigits, actualLength: length } }
      : null;
  }

  handleInput(event: Event): void {
    if (event instanceof InputEvent && event.isComposing) return;
    const input = this.element.nativeElement;
    const position = input.selectionStart ?? input.value.length;
    const significantBeforeCaret = input.value.slice(0, position).replace(/[^\d+]/g, '').length;
    const normalized = normalizePhone(input.value);
    const prefix = normalized.startsWith('+') ? '+' : '';
    const value = prefix + normalized.replace(/\D/g, '').slice(0, this.appPhoneMaxDigits);
    const formatted = formatPhone(value);
    this.renderer.setProperty(input, 'value', formatted);
    let caret = 0;
    let significant = 0;
    while (caret < formatted.length && significant < significantBeforeCaret) {
      if (/[\d+]/.test(formatted[caret])) significant++;
      caret++;
    }
    input.setSelectionRange(caret, caret);
    this.onChange(value);
  }

  handleBeforeInput(event: InputEvent): void {
    const input = this.element.nativeElement;
    const start = input.selectionStart;
    if (start === null || start !== input.selectionEnd) return;
    const backward = event.inputType === 'deleteContentBackward';
    const forward = event.inputType === 'deleteContentForward';
    const separator = backward ? start - 1 : start;
    if ((!backward && !forward) || input.value[separator] !== '-') return;
    // Deleting next to a separator removes the adjacent digit, so backspace never gets stuck.
    event.preventDefault();
    const from = backward ? Math.max(0, start - 2) : start;
    const to = backward ? start : start + 2;
    this.renderer.setProperty(input, 'value', input.value.slice(0, from) + input.value.slice(to));
    input.setSelectionRange(from, from);
    this.handleInput(event);
  }
}
