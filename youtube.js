const youtubedl = require('youtube-dl-exec');

class Youtube {
    async getVideo(videoUrl) {
        try {
            const output = await youtubedl(videoUrl, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: [
                    'referer:youtube.com',
                    'user-agent:googlebot',
                ],
            });

            return output;

        } catch (error) {
            return null;
        }
    }
}

module.exports = Youtube