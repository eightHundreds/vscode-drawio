import { window, OutputChannel,workspace } from "vscode";
// eslint-disable-next-line no-underscore-dangle
let _channel: OutputChannel;
function getChannel() {
    if (!_channel) {
        _channel = window.createOutputChannel("DrawIOEditor");
    }
    return _channel;
}

export class Logger {
    public static debug(message:string){
        if (
            process.env.NODE_ENV === "production"
            && !workspace.getConfiguration('vscode-drawio').get('debug')
        ) {
            return;
        }
        getChannel().appendLine(
            `[DEBUG} - ${new Date()}] ${message}`,
        );
    }
}
