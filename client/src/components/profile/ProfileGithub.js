import React from 'react'
import PropTypes from 'prop-types'

class ProfileGithub extends React.Component {
  state = {
    clientId: '56274e4c9c2196cbd631',
    clientSecret: '0038d67cd91432a9e8185a7411b87bd5a34ab9f9',
    count: 5, // how many repos we want
    sort: 'created: asc',
    repos: []
  }

componentDidMount() {
  const {count, sort, clientId, clientSecret } = this.state
  fetch(`https://api.github.com/users/${this.props.username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
  .then(res => res.json())
  .then(data => {
    if(this.refs.myRef) {
      this.setState({
        repos: data
      })
    }

  }).catch(err => console.log(err))
}


  render () {
    const { repos } = this.state;
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} rel="noopener noreferrer" target="_blank">
              {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
          </span>  <span className="badge badge-success ">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ))
    return (
      <div ref="myRef">
        <hr/>
        <h3 className="mb-4">Latest GitHub Repos</h3>
        {repoItems}
      </div>
    )
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
}
export default ProfileGithub;
