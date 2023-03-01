export class Loading {
  static show(text = 'Loading'): void {
    const mask = document.getElementById('loading') as HTMLDivElement;
    const innerText = mask.getElementsByClassName('loading-text')[0] as HTMLSpanElement;
    innerText.innerText = text;
    mask.classList.remove('hidden');
  }

  static hide(): void {
    const mask = document.getElementById('loading') as HTMLDivElement;
    mask.classList.add('hidden');
  }
}
