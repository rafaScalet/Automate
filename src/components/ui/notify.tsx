import { createRoot } from 'react-dom/client';
import { Toast } from '@/components/ui/Toast';

type NotifyType = 'success' | 'error' | 'warning' | 'info';

export function notify(message: string, type: NotifyType = 'success') {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(<Toast message={message} type={type} onClose={handleClose} />);
}
