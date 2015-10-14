var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <ul className="commentList">
        {commentNodes}
      </ul>
    );
  }
});
