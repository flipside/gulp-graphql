function User(id, name) {
  this.id = id.toString();
  this.name = name;
}

function Widget(id, name, userId) {
  this.id = id.toString();
  this.name = name;
  this.userId = userId;
}

var viewer = new User(1, 'Viewer');
var users = [viewer];

var widgets = [
  new Widget(1, 'What\'s-it', viewer.id),
  new Widget(2, 'Who\'s-it', viewer.id),
  new Widget(3, 'How\'s-it', viewer.id),
];

module.exports = {
  User: User,
  Widget: Widget,
  getUser: function (id) {
    return users.find(function (u) {
      return u.id == id;
    });
  },
  getViewer: function () {
    return viewer;
  },
  getWidget: function (id) {
    return widgets.find(function (w) {
      return w.id == id;
    });
  },
  getWidgetsByUser: function (userId) {
    return widgets.filter(function (w) {
      return w.userId == userId;
    });
  },
};
