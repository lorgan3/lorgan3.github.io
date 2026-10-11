export const ADVENTURES = {
  submarine: {
    id: 'submarine',
    title: 'Submarine',
    card: 'assets/img/submarine_card.png',
    background: 'assets/img/submarine_bg.jpg',
    logo: 'assets/img/submarine_logo.png',
    accent: '#ffc61a',
    print: [{ label: 'Printbaar materiaal', href: 'assets/print/submarine_download1.pdf' }],
  },
  behindenemylines: {
    id: 'behindenemylines',
    title: 'Behind Enemy Lines',
    card: 'assets/img/bel_card.png',
    background: 'assets/img/bel_bg.jpg',
    logo: 'assets/img/bel_logo.png',
    accent: '#9fb36a',
    print: [
      { label: 'Printbaar materiaal 1', href: 'assets/print/bel_download1.pdf' },
      { label: 'Printbaar materiaal 2', href: 'assets/print/bel_download2.pdf' },
    ],
  },
};

export function adventureFromUrl() {
  const id = new URLSearchParams(location.search).get('a');
  return ADVENTURES[id] || null;
}
