export default function decorate(block) {
  // Request higher resolution for the section background image
  const section = block.closest('.section');
  if (section) {
    const bgImg = section.querySelector('.bg-image img');
    if (bgImg && bgImg.src.includes('width=750')) {
      bgImg.src = bgImg.src.replace('width=750', 'width=2000');
      bgImg.loading = 'eager';
    }
  }
}
