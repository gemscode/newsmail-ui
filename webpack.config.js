module.exports = {
	mode: 'development',
	devServer: {
		headers: { 'Access-Control-Allow-Origin': '*' },
   		https: false,
		host: '0.0.0.0',
		public: 'rp78.zeroxcc.com:7821',
    		disableHostCheck: true,
		allowedHosts: ['.zeroxcc.com', 'rp78.zeroxcc.com','ec2-3-143-71-233.us-east-2.compute.amazonaws.com'],
		hot: true,
		stats: 'verbose',
		clientLogLevel: 'debug',
  	}
};
