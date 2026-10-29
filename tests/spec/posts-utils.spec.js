'use strict';

describe('postsUtils', function() {
    var postsUtils;

    beforeEach(module('app.data'));
    beforeEach(inject(function(_postsUtils_) {
        postsUtils = _postsUtils_;
    }));

    it('returns the requested number of posts ordered newest first', function() {
        var posts = [{date: '2026-01-01'}, {date: '2026-03-01'}, {date: '2026-02-01'}];
        expect(postsUtils.recent(posts, 2)).toEqual([{date: '2026-03-01'}, {date: '2026-02-01'}]);
    });

    it('excludes posts older than the requested interval', function() {
        var recent = {date: new Date(Date.now() - 86400000).toISOString()};
        var old = {date: new Date(Date.now() - 90 * 86400000).toISOString()};
        expect(postsUtils.postsDuringInterval([old, recent], 30)).toEqual([recent]);
    });
});
