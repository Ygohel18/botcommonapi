const axios = require('axios')
const urlMetadata = require('url-metadata')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

class Instagram {

    setHeaders(headers) {
        this.headers = headers;
    }

    getConfig(url, method = "get") {

        var config = {
            method: method,
            url: url,
            headers: this.headers,
        };

        return config;
    }

    shortcodeToID(shortcode) {
        var char;
        var id = 0;
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        for (var i = 0; i < shortcode.length; i++) {
            char = shortcode[i];
            id = (id * 64) + alphabet.indexOf(char);
        }
        return id;
    }

    async getProfile(username) {
        var url = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + username;

        return axios(this.getConfig(url)).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getFollowRequest(count, next) {
        var url = "https://www.instagram.com/api/v1/friendships/pending/?count=" + count + "&max_id=" + next;

        return axios(this.getConfig(url), 'post').then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async follow(username) {

        var u = await this.getProfile(username);

        var url = "https://www.instagram.com/api/v1/web/friendships/" + u.data.user.id + "/follow/";
        console.log(url);

        return axios(this.getConfig(url,'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async unfollow(username) {

        var u = await this.getProfile(username);

        var url = "https://www.instagram.com/api/v1/web/friendships/" + u.data.user.id + "/unfollow/";
        console.log(url);

        return axios(this.getConfig(url,'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async remove(username) {

        var u = await this.getProfile(username);

        var url = "https://www.instagram.com/api/v1/web/friendships/" + u.data.user.id + "/remove_follower/";
        console.log(url);

        return axios(this.getConfig(url,'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getMyFollowers() {

        var url = "https://www.instagram.com/api/v1/friendships/show_many/";

        console.log(url);
        return axios(this.getConfig(url, 'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getFollowersByQuery(username, next, count) {
        var u = await this.getProfile(username);

        var url = `https://www.instagram.com/graphql/query/?query_id=${process.env.IG_FOLLOWERS}&variables=` +  encodeURIComponent(`{"id":"${u.data.user.id}","first":${count},"after":"${next}"}`);
        return axios(this.getConfig(url, 'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getFollowingsByQuery(username, next, count) {
        var u = await this.getProfile(username);

        var url = `https://www.instagram.com/graphql/query/?query_id=${process.env.IG_FOLLOWING}&variables=` +  encodeURIComponent(`{"id":"${u.data.user.id}","first":${count},"after":"${next}"}`);
        return axios(this.getConfig(url, 'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getFollowers(username, next, count) {

        var u = await this.getProfile(username);

        var url = "https://i.instagram.com/api/v1/friendships/" + u.data.user.id + "/followers/?count=" + count + "&max_id=" + next + "&search_surface=follow_list_page";

        console.log(url);
        return axios(this.getConfig(url)).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getFollowings(username, next, count) {

        var u = await this.getProfile(username);

        var url = "https://i.instagram.com/api/v1/friendships/" + u.data.user.id + "/following/?count=" + count + "&max_id=" + next;

        console.log(url);
        return axios(this.getConfig(url)).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getUserMedia(username, next, count) {

        var u = await this.getProfile(username);

        var url = "https://i.instagram.com/api/v1/feed/user/" + u.data.user.id + "?count=" + count + "&max_id=" + next;

        return axios(this.getConfig(url, "post")).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getThread(limit,messageLimit,cursor) {

        var url = `https://i.instagram.com/api/v1/direct_v2/inbox/?persistentBadging=true&folder=&limit=${limit}&thread_message_limit=${messageLimit}&cursor=${cursor}`;

        return axios(this.getConfig(url, "post")).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getReelSingle(username) {

        var u = await this.getProfile(username);
        var url = "https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=" + u.data.user.id;

        return axios(this.getConfig(url)).then(function (response) {
            return JSON.stringify(response.data);
        }).catch(function (error) {
            return error;
        });
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    async getUserMediaByQuery(username, next, count) {
        var u = await this.getProfile(username);

        var url = `https://www.instagram.com/graphql/query/?query_id=${process.env.IG_POSTS_USER}&variables=` +  encodeURIComponent(`{"id":"${u.data.user.id}","first":${count},"after":"${next}"}`);
        return axios(this.getConfig(url, 'post')).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getMedia(shortcode) {

        var u = shortcode;

        if (shortcode.includes('/stories/')) {
            u = shortcode.split("/")[5];
        }

        if (this.isNumeric(u)) {
            console.log(u);
            var id = u;
        } else {
            
            id = await this.getMediaId(u);
        }

        var url = "https://www.instagram.com/api/v1/media/" + id + "/info/";

        return axios(this.getConfig(url)).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return error;
        });
    }

    async getMediaId(url) {
        return urlMetadata(url).then(function (metadata) {
            var str = metadata['al:ios:url'];
            str = str.split("?id=");
            return str[1];
        }).catch(function (error) {
            return 0;
        });
    }

}

module.exports = Instagram