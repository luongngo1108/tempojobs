import { set, connect as _connect } from 'mongoose';
set("strictQuery", false);

const connect = async () => {
    try {
        const connect = await _connect(process.env.CONNECTION_STRING);
        console.log(`Database connected: ${connect.connection.host}/${connect.connection.name}`);
    } catch(err) {
        console.log('Connection failed!!!\n Error: ' + err);
        process.exit(1);
    }
}

export default connect;