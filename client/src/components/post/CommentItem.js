import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteComment } from '../../actions/postActions'

class CommentItem extends React.Component {

  onDeleteClick = (postId, commentId) => {
    this.props.deleteComment(postId, commentId)
  }


  render () {


    const { comment, postId, auth } = this.props;
    return (
      <div className="card card-body mb-3">
            <div className="row">
              <div className="col-md-2">
                  <img className="rounded-circle d-none d-md-block" src={comment.avatar} alt="" />
                <br />
                <p className="text-center">{comment.name}</p>
              </div>
              <div className="col-md-10">
                <p className="lead">{comment.text}.</p>
                {comment.user === auth.user.id ? (
                  <button
                    onClick={() => this.onDeleteClick(postId, comment._id)}
                    type="button"
                    className="button btn btn-danger">
                  <i className="fas fa-times"/>
                  </button>) : null
                }
              </div>
            </div>
          </div>
    )
  }
}

Comment.PropTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps, { deleteComment })(CommentItem);
