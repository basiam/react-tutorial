"use strict";

var Comment = React.createClass({
  displayName: "Comment",

  rawMarkup: function rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return { __html: rawMarkup };
  },
  render: function render() {
    return React.createElement(
      "li",
      { className: "comment" },
      React.createElement(
        "h2",
        { className: "commentAuthor" },
        this.props.author
      ),
      React.createElement("span", { dangerouslySetInnerHTML: this.rawMarkup() })
    );
  }
});
'use strict';

var CommentForm = React.createClass({
  displayName: 'CommentForm',

  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    this.refs.author.value = '';
    this.refs.text.value = '';
    return;
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'commentForm', onSubmit: this.handleSubmit },
      React.createElement('input', { type: 'text', placeholder: 'Your name', ref: 'author' }),
      React.createElement('input', { type: 'text', placeholder: 'Say something...', ref: 'text' }),
      React.createElement('input', { type: 'submit', value: 'Post' })
    );
  }
});
"use strict";

var CommentList = React.createClass({
  displayName: "CommentList",

  render: function render() {
    var commentNodes = this.props.data.map(function (comment) {
      return React.createElement(
        Comment,
        { author: comment.author, key: comment.author },
        comment.text
      );
    });
    return React.createElement(
      "ul",
      { className: "commentList" },
      commentNodes
    );
  }
});
'use strict';

var CommentBox = React.createClass({
  displayName: 'CommentBox',

  loadCommentsFromServer: function loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (function (data) {
        this.setState({ data: data });
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  handleCommentSubmit: function handleCommentSubmit(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({ data: newComments });
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: (function (data) {
        this.setState({ data: data });
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'commentBox' },
      React.createElement(
        'h1',
        null,
        'Comments'
      ),
      React.createElement(CommentList, { data: this.state.data }),
      React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
    );
  }
});
ReactDOM.render(React.createElement(CommentBox, { url: '/api/comments', pollInterval: 2000 }), document.getElementById('content'));
