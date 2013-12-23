/*jshint node:true*/
module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({ /* Autoprefixer */
		autoprefixer: {
			options: {
				browsers: ['last 3 version', 'ie 8', 'ie 7']
			},
			single_file: {
				src: 'css/index.css',
				dest: 'css/index.prefixed.css'
			}
		},
		uglify: {
			my_target: {
				files: {
					'js/source.min.js': ['js/geo.js', 'js/index.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['autoprefixer', 'uglify']);
};