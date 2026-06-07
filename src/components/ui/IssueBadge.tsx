import { Severity } from '@/utils/types';
import { AlertTriangle, XOctagon, Lightbulb, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const CONFIG = {
  critical:   { icon: XOctagon,      cls: 'tag-critical', label: 'Critical' },
  warning:    { icon: AlertTriangle,  cls: 'tag-warning',  label: 'Warning' },
  suggestion: { icon: Lightbulb,      cls: 'tag-suggestion', label: 'Suggestion' },
  good:       { icon: CheckCircle,    cls: 'tag-good',     label: 'Good' },
};

export default function IssueBadge({ severity }: { severity: Severity }) {
  const { icon: Icon, cls, label } = CONFIG[severity];
  return (
    <span className={clsx('pill', cls)}>
      <Icon size={10} />
      {label}
    </span>
  );
}
