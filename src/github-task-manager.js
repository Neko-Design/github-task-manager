process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

export function placeholder(test) {
    if (test) {
        test = test + 'test';
        console.log('placeholder');
    }
    return test;
}