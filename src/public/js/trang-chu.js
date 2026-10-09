document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.faq__button');

  const closeFaq = (button) => {
    const answerId = button.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;
    const icon = button.querySelector('.faq__icon');

    button.setAttribute('aria-expanded', 'false');
    if (answer) answer.hidden = true;
    if (icon) icon.textContent = 'expand_more';
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const answerId = button.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : null;
      const icon = button.querySelector('.faq__icon');
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      buttons.forEach((otherButton) => closeFaq(otherButton));

      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
        if (icon) icon.textContent = 'expand_less';
      }
    });
  });
});
