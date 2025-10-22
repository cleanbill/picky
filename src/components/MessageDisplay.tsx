import { Message } from '@/types';

type Props = {
    message: Message | null
}

const MessageDisplay = ({ message }: Props) => {
    if (!message) {
        return null;
    }
    return (
        <div className={`p-3 mb-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
            {message.text}
        </div>
    )
}

export default MessageDisplay;