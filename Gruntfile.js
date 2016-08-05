/*
 *
 */

module.exports = function (grunt) {

	/**
	 * Files added to WordPress SVN, don't include 'assets/**' here.
	 * @type {Array}
	 */
	// svn_files_list = [
	// 	'readme.txt',
	// 	'read-offline.php',
	// 	'css/**',
	// 	'inc/**',
	// 	'js/**',
	// 	'languages/**',
	// 	'lib/**',
	// 	'templates/**',
	// 	'vendor/**'
	// ];

	/**
	 * Let's add a couple of more files to GitHub
	 * @type {Array}
	 */
	git_files_list = [
		'README.md',
		'CREDITS.md',
		'package.json',
		'Gruntfile.js',
		'ttfonts/**',
		'examples/**'
	];

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON( 'package.json' ),
		gittag: {
			addtag: {
				options: {
					tag: '<%= pkg.version %>',
					message: 'Version <%= pkg.version %>'
				}
			}
		},
		gitcommit: {
			commit: {
				options: {
					message: 'Version <%= pkg.version %>',
					noVerify: true,
					noStatus: false,
					allowEmpty: true
				},
				files: {
					src: [ git_files_list ]
				}
			}
		},
		gitpush: {
			push: {
				options: {
					tags: true,
					remote: 'origin',
					branch: 'master'
				}
			}
		},
		replace: {
			reamde_md: {
				src: [ 'README.md' ],
				overwrite: true,
				replacements: [{
					from: /~Current Version:\s*(.*)~/,
					to: "~Current Version: <%= pkg.version %>~"
				}, {
					from: /Latest Stable Release:\s*\[(.*)\]\s*\(https:\/\/github.com\/soderlind\/read-offline\/releases\/tag\/(.*)\s*\)/,
					to: "Latest Stable Release: [<%= pkg.git_tag %>](https://github.com/soderlind/read-offline/releases/tag/<%= pkg.git_tag %>)"
				}]
			},
			plugin_php: {
				src: [ '<%= pkg.main %>' ],
				overwrite: true,
				replacements: [{
					from: /Version:\s*(.*)/,
					to: "Version: <%= pkg.version %>"
				}, {
					from: /define\(\s*'READOFFLINE_VERSION',\s*'(.*)'\s*\);/,
					to: "define( 'READOFFLINE_VERSION', '<%= pkg.version %>' );"
				}]
			}
		},
		githubChanges: {
			dist : {
				options: {
					// Owner and Repository options are mandatory
					owner : 'soderlind',
					repository : '<%= pkg.name %>',
					useCommitBody: true,
					verbose : true
				}
			}
		},
		makepot: {
		    target: {
		        options: {
		            domainPath: '/languages',
		            mainFile: '<%= pkg.main %>',
		            potFilename: '<%= pkg.name %>.pot',
		            potHeaders: {
		                poedit: true,
		                'x-poedit-keywordslist': true
		            },
		            bugsurl: '<%= pkg.bugs.url%>',
		            processPot: function( pot, options ) {
	                    pot.headers['report-msgid-bugs-to'] = options.bugsurl;
	                    /*pot.headers['language-team'] = 'Team Name <team@example.com>';*/
	                    return pot;
	                },
		            type: 'wp-plugin',
		            updateTimestamp: true,
		            exclude: [
		            	'ttfonts/.*',
		            	'node_modules/.*'
		            ],
		        }
		    }
		}, //makepot
	});



	//load modules
	// grunt.loadNpmTasks( 'grunt-glotpress' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-git' );
	grunt.loadNpmTasks( 'grunt-text-replace' );
	grunt.loadNpmTasks( 'grunt-svn-export' );
	grunt.loadNpmTasks( 'grunt-push-svn' );
	grunt.loadNpmTasks( 'grunt-remove' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-file-creator' );
	grunt.loadNpmTasks( 'grunt-github-changes' );

	grunt.registerTask('syntax', 'default task description', function(){
	  console.log('Syntax:\n' +
	  				'\tgrunt release (pre_vcs, do_git)\n' +
	  				'\tgrunt pre_vcs (update plugin version number in files, make languages/.pot)\n' +
	  				'\tgrunt do_git (gitcommit, gittag, gitpush)'
	  	);
	});

	grunt.registerTask( 'default', ['syntax'] );
	grunt.registerTask( 'version_number', [ 'replace:reamde_md', 'replace:plugin_php' ] );
	grunt.registerTask( 'pre_vcs', [ 'version_number', 'makepot'] );
	grunt.registerTask( 'changelog', [ 'githubChanges:dist'] );

	grunt.registerTask( 'do_git', [  'gitcommit', 'gittag', 'gitpush' ] );
	grunt.registerTask( 'release', [ 'pre_vcs',  'do_git' ] );

};

/**
 * Helper
 */
// from http://stackoverflow.com/a/4026828/1434155
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
