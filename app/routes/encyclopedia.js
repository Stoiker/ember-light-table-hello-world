import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return [{
      id: 'Quarkos',
      type: 'Water',
      healthpoints: 12,
      weakness:'Fire',
      picture: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/3195dialock.png',
    },
    {
      id: 'Gaeas',
      type: 'Earth',
      healthpoints: 15,
      weakness:'Water',
      picture: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Amelie_300dpi.png',
    }, {
      id: 'Lightos',
      type: 'Fire',
      healthpoints: 9,
      weakness:'Earth',
      picture: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Devil_cartoon_charactor.png',
    }];
    }
});
