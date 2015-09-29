function User(id, name) {
  this.id = id.toString()
  this.name = name
}

function Widget(id, userId, name) {
  this.id = id.toString()
  this.userId = userId.toString()
  this.name = name
}

var users = [new User(1, 'Me')]

var widgets = [
  new Widget(1, 1, 'What\'s-it'),
  new Widget(2, 1, 'Who\'s-it'),
  new Widget(3, 1, 'How\'s-it'),
]

module.exports = {
  User: User,
  Widget: Widget,
  getUser: function (id) {
    return users.filter(function (u) {
      return u.id == id;
    })[0];
  },
  getAnonymousUser: function () {
    return users[0]
  },
  getWidget: function (id) {
    return widgets.filter(function (w) {
      return w.id == id;
    })[0];
  },
  getWidgetsByUser: function (userId) {
    return widgets.filter(function (w) {
      return w.userId == userId;
    });
  },
}
