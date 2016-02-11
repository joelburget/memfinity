/*
 * Interface for feed mode
 */
import $ from 'jquery';
import React from 'react';
import { Link } from 'react-router';

import gravatar from './gravatar';
import UserHeader from './userheader';

// props: model
var UserCard = React.createClass({
    render: function() {
        var cardActionButtons;
        if (window.username === null) {
            cardActionButtons = null;
        } else if (window.username !== this.props.user.email) {
            cardActionButtons = null;
            // TODO.. should implement a *follow* button here...
            //<div className='btn btn-primary btn-small' onClick={this.takeCard}>
            //   <i className='icon-download'></i> Take
            //</div>;
        };
        var front = this.props.user.nickname,
            back = this.props.user.name;
        return <div className='feedcard row-fluid'>
            <UserCardMeta user={this.props.user} />
            <div className='feedcard_right span10'>
                <div className='feedcard_front'>{front}</div>
                <div className='feedcard_back'>{back}</div>
                <div className="feedcard_meta row-fluid">
                    <div className='span3 btn-container'>
                        {cardActionButtons}
                    </div>
                </div>
            </div>
        </div>;
    }
});

var UserCardMeta = React.createClass({
    render: function() {
        // TODO get this info from google
        // http://stackoverflow.com/q/3591278/2121468
        // TODO DRY this up with-- duplicates FeedCardMeta in feed.jsx
        var userImage = gravatar(this.props.user.email, 60),
            photoStyle = {background: 'url(' + userImage + ') no-repeat'};
        return <div className='feedcard_userinfo span2'>
            <Link to="/user" userKey={this.props.user.key}>
                <div className='feedcard_photo' style={photoStyle} />
                <div className='feedcard_desc'>
                    <div className='feedcard_username'>
                        {this.props.user.nickname}
                    </div>
                </div>
            </Link>
        </div>;
    }
});

// props: userKey, followersOrFollowing
var Follows = React.createClass({
    render: function() {
        if (!this.state.followsData) {
            return <div>Count to ten, your data will be arriving shortly.</div>;
        }

        var userDicts;
        if (this.props.followersOrFollowing === 'following') {
            userDicts = this.state.followsData.following;
        } else {
            userDicts = this.state.followsData.followers;
        }

        var userItems = _(userDicts).map(function(user) {
            return <li className="l-feedcard-container" key={user.email}>
                <UserCard user={user} key={user.email} />
            </li>;
        });

        return <div>
            <UserHeader userData={this.state.followsData.user_data} />
            <div className='feed clearfix'>
                <ol className='feedbody'>
                    {userItems}
                </ol>
            </div>
        </div>;
    },
    getInitialState: function() {
        // TODO set some state for a spinner?
        return { followsData: null };
    },
    componentDidMount: function() {
        if (!this.state.followsData) {
            // force an API call to retrieve cards
            this.fetchData();
        }
    },
    fetchData: function() {
        var self = this;
        var url = '/api/user/' + this.props.userKey + '/follows';
        $.get(url, function(response) {
            self.setState({followsData: JSON.parse(response)});
        });
    }
});

var Following = React.createClass({
    render: function() {
        return <Follows userKey={this.props.params.userKey} followersOrFollowing="following" />
    }
});

var Followers = React.createClass({
    render: function() {
        return <Follows userKey={this.props.params.userKey} followersOrFollowing="followers" />
    }
});

module.exports = {
    Following: Following,
    Followers: Followers
};
