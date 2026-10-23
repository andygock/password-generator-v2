import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.css';

// One active tooltip prevents delayed hover dismissal from leaving old help open.
let activeTooltip = null;

// Portal positioning avoids clipping inside scrolling tables. A short grace
// period lets the pointer cross from the trigger to the adjacent help text.
export default function Tooltip({
  label = 'More information',
  align = 'left',
  placement = 'bottom',
  trigger,
  children,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchor = useRef(null);
  const content = useRef(null);
  const timer = useRef(null);
  const hovered = useRef(false);
  const pointer = useRef(null);
  const close = useCallback(() => {
    clearTimeout(timer.current);
    hovered.current = false;
    setOpen(false);
    if (activeTooltip?.id === id) activeTooltip = null;
  }, [id]);
  const show = () => {
    if (activeTooltip?.id !== id) activeTooltip?.close();
    activeTooltip = { id, close };
    clearTimeout(timer.current);
    setOpen(true);
  };
  const enter = () => {
    hovered.current = true;
    show();
  };
  const leave = () => {
    hovered.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!hovered.current && !anchor.current?.contains(document.activeElement))
        close();
    }, 200);
  };
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (activeTooltip?.id === id) activeTooltip = null;
    },
    [id]
  );
  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open, close]);
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const bounds = anchor.current.getBoundingClientRect();
      const popup = content.current;
      const { width, height } = popup.getBoundingClientRect();
      const x = pointer.current?.x ?? bounds.left;
      const y = pointer.current?.y ?? (bounds.top + bounds.bottom) / 2;
      const gap = 12;
      let left;
      let top;
      // Prefer the left of the pointer to keep the following row unobscured.
      if (x - gap - width >= 8) {
        left = x - gap - width;
        top = y - height / 2;
      } else if (
        (pointer.current?.x ?? bounds.right) + gap + width <=
        window.innerWidth - 8
      ) {
        left = (pointer.current?.x ?? bounds.right) + gap;
        top = y - height / 2;
      } else {
        left = align === 'right' ? bounds.right - width : bounds.left;
        const above = placement === 'top' || bounds.top - height - gap >= 8;
        top = above ? bounds.top - height - gap : bounds.bottom + gap;
      }
      popup.style.left = `${Math.max(8, Math.min(left, window.innerWidth - width - 8))}px`;
      popup.style.top = `${Math.max(8, Math.min(top, window.innerHeight - height - 8))}px`;
    };
    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [open, align, placement, children]);
  const target = trigger || (
    <button
      type="button"
      className={styles.trigger}
      aria-label={label}
      onClick={show}
    >
      ?
    </button>
  );
  return (
    <span
      ref={anchor}
      className={styles.tooltip}
      onMouseEnter={(event) => {
        pointer.current = { x: event.clientX, y: event.clientY };
        enter();
      }}
      onMouseLeave={leave}
      onFocus={() => {
        pointer.current = null;
        show();
      }}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          !hovered.current
        )
          close();
      }}
    >
      {cloneElement(target, {
        'aria-describedby':
          [target.props['aria-describedby'], open ? id : null]
            .filter(Boolean)
            .join(' ') || undefined,
      })}
      {open &&
        createPortal(
          <span
            ref={content}
            id={id}
            className={styles.content}
            role="tooltip"
            onMouseEnter={enter}
            onMouseLeave={leave}
          >
            {children}
          </span>,
          document.body
        )}
    </span>
  );
}
