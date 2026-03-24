'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useLanguage();
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState<number | null>(null);

  const galleryImages = project?.galleryImages ?? [];
  const totalGallery = galleryImages.length;

  const closeLightbox = useCallback(() => setGalleryLightboxIndex(null), []);
  const goPrev = useCallback(() => {
    setGalleryLightboxIndex((i) => (i == null ? null : i === 0 ? totalGallery - 1 : i - 1));
  }, [totalGallery]);
  const goNext = useCallback(() => {
    setGalleryLightboxIndex((i) => (i == null ? null : i === totalGallery - 1 ? 0 : i + 1));
  }, [totalGallery]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (galleryLightboxIndex == null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [galleryLightboxIndex, closeLightbox, goPrev, goNext]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-black dark:text-white">{project.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            aria-label={t('projects.closeAria')}
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">{project.subtitle}</p>

        <div className="relative mb-6 aspect-video overflow-hidden rounded-xl border border-white/20 bg-neutral-100/80 dark:bg-neutral-900/60">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {project.fullDescription.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{t('projects.gallery')}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGalleryLightboxIndex(i)}
                  className="relative aspect-video rounded-lg overflow-hidden border border-white/20 bg-gray-100/80 hover:opacity-90 transition-opacity"
                >
                  <img src={src} alt={`${project.title} galería ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {project.sectionImages && project.sectionImages.length > 0 &&
          project.sectionImages.map((section, idx) => (
            <div key={idx} className="mt-8">
              <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{section.sectionTitle}</h4>
              <div className="flex flex-wrap gap-4">
                {section.images.map((imgSrc, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-white/20 aspect-video max-w-xs">
                    <img src={imgSrc} alt={`${section.sectionTitle} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{t('projects.technologies')}</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-white/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{t('projects.tags')}</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black/80 dark:bg-white/20 text-white rounded-full text-sm border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-8 inline-flex items-center gap-2 bg-black/80 dark:bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-black dark:hover:bg-white/30 transition-colors border border-white/20 backdrop-blur-sm"
        >
          {t('projects.close')}
          <ChevronRight size={16} />
        </button>
      </div>

      {galleryLightboxIndex !== null && totalGallery > 0 && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          aria-modal
          role="dialog"
          aria-label={t('projects.gallery')}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label={t('projects.previousAria')}
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={galleryImages[galleryLightboxIndex]}
            alt={`${project.title} galería ${galleryLightboxIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label={t('projects.nextAria')}
          >
            <ChevronRight size={28} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label={t('projects.closeAria')}
          >
            <X size={24} />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {galleryLightboxIndex + 1} / {totalGallery}
          </span>
        </div>
      )}
    </div>
  );
}