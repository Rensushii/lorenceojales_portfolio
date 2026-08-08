'use client';

import { FileText, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';

export function ResumeModal() {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  return (
    <Modal isOpen={activeModal === 'modal-resume'} onClose={closeModal} labelledBy="resume-title" size="wide">
      <div className="flex h-[80vh] flex-col">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 pr-8">
          <h2 id="resume-title" className="flex items-center gap-1.5 text-[1.1rem] font-bold text-white">
            <FileText size={18} className="text-accent-cyan" /> Lorence Ojales — Resume
          </h2>
          <a
            href="/resume.pdf"
            download="Lorence_Ojales_Resume.pdf"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-btn px-3.5 py-2 text-[0.76rem] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Download size={14} /> Download PDF
          </a>
        </div>
        <iframe
          src="/resume.pdf#toolbar=1&navpanes=1&scrollbar=1"
          title="Lorence Ojales Resume"
          className="flex-1 rounded-sm border-none bg-white"
        />
      </div>
    </Modal>
  );
}
