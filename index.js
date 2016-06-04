var graphql = require('graphql')
var graphqlHTTP = require('express-graphql')
var express = require('express')

import * as _ from 'underscore';

import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql'

import postData from './posts.js'
import commentData from './comments.js'

// const postData = require('./posts.json')

const Comment = new graphql.GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLInt },
    authorName: { type: GraphQLString },
    content: { type: GraphQLString }
  })
})

const Post = new graphql.GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    content: {  type: GraphQLString },
    authorName: { type: GraphQLString },
    comment: {
      type: new GraphQLList(Comment),
      args: {
        limit: {type: GraphQLInt }
      },
      resolve: function(Post, {limit}) {
        if(limit >= 0) {
          return commentData.slice(0, limit);
        }
        return commentData;
      }
    },
  })
})

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'getPost',
    fields: {
      post: {
        type: Post,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (source, {id}) => {
          return _.filter(postData, post => post.id === id)[0];
        }
      }
    }
  })
})

express()
  .use('/posts', graphqlHTTP({ schema: schema, pretty: true }))
  .listen(process.env.PORT || 3000, function(){
    console.log("Running on port %d", this.address().port);
  })
