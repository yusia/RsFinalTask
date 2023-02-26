export class Loading {
  static show(): void {
    const mask = document.getElementById('loading') as HTMLDivElement;
    mask.getElementsByClassName('')
    mask.classList.remove('hidden');
  }

  static hide(): void {
    const mask = document.getElementById('loading') as HTMLDivElement;
    mask.classList.add('hidden');
  }
}
