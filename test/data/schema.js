var GraphQL = require('graphql')
var GraphQLRelay = require('graphql-relay')
var db = require('./database')

var GraphQLObjectType = GraphQL.GraphQLObjectType,
    GraphQLString = GraphQL.GraphQLString,
    GraphQLSchema = GraphQL.GraphQLSchema;

var connectionArgs = GraphQLRelay.connectionArgs,
    connectionDefinitions = GraphQLRelay.connectionDefinitions,
    connectionFromArray = GraphQLRelay.connectionFromArray,
    fromGlobalId = GraphQLRelay.fromGlobalId,
    globalIdField = GraphQLRelay.globalIdField,
    nodeDefinitions = GraphQLRelay.nodeDefinitions;

var Widget = db.Widget,
    User = db.User,
    getUser = db.getUser,
    getWidget = db.getWidget,
    getWidgetsByUser = db.getWidgetsByUser,
    getViewer = db.getViewer;


var nodeDefinitions = nodeDefinitions(function (globalId) {
    var idInfo = fromGlobalId(globalId)
    if (idInfo.type == 'User') {
      return getUser(idInfo.id)
    } else if (idInfo.type == 'Widget') {
      return getWidget(idInfo.id)
    }
    return null
  },
  function (obj) {
    if (obj instanceof Widget) {
      return widgetType;
    } else if (obj instanceof User) {
      return userType;
    }
    return null;
  }
);

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: {
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  },
  interfaces: [nodeDefinitions.nodeInterface],
});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: function () {
    return {
      id: globalIdField('User'),
      name: {
        type: GraphQLString,
        description: 'The name of the user',
      },
      widgets: {
        description: 'A user\'s collection of widgets',
        type: WidgetConnection.connectionType,
        args: connectionArgs,
        resolve: function (user, args) {
          return connectionFromArray(getWidgetsByUser(user.id), args)
        },
      },
    }
  },
  interfaces: [nodeDefinitions.nodeInterface],
});

var WidgetConnection = connectionDefinitions(
  {
    name: 'Widget',
    nodeType: widgetType
  }
);

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeDefinitions.nodeField,
    viewer: {
      type: userType,
      resolve: function () {
        return getViewer();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: queryType
});
