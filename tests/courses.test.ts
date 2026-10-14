import { describe, it, expect } from 'vitest';
import { parseYouTubeUrl } from '../src/utils/youtubeUtils';
import { OFFICIAL_COURSES } from '../src/data/coursesData';
import { courseCatalogService, PROVIDED_COURSES_CONFIG } from '../src/services/courseCatalogService';

describe('VertexLearn AI - 13 Official Courses & YouTube Integration', () => {
  it('contains exactly 13 official courses in data definitions', () => {
    expect(OFFICIAL_COURSES.length).toBe(13);
    expect(PROVIDED_COURSES_CONFIG.length).toBe(13);
  });

  it('correctly maps all 13 courses to their configured URLs and categories', () => {
    const expectedTracks = [
      { id: 'c_frontend', category: 'Frontend', url: 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH' },
      { id: 'c_backend', category: 'Backend', url: 'https://www.youtube.com/watch?v=kkOuRJ69BRY&list=PLbtI3_MArDOk_A-GnYHPOiHSxlK2Vd3Zn' },
      { id: 'c_mern', category: 'MERN Stack', url: 'https://www.youtube.com/watch?v=rklidcZ-aLU&list=PL78RhpUUKSwfYr_bKHq7SWfTCBGad_xxP' },
      { id: 'c_mean', category: 'MEAN Stack', url: 'https://www.youtube.com/watch?v=1biOTNHgJqs&list=PL1fhe5A01vQEGcHsPyQk3otWTrq6b9XXB' },
      { id: 'c_dsa', category: 'Data Structures and Algorithms (DSA)', url: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt' },
      { id: 'c_java', category: 'Java', url: 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt' },
      { id: 'c_python', category: 'Python', url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti' },
      { id: 'c_data_analytics', category: 'Data Analytics', url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti' },
      { id: 'c_data_engineering', category: 'Data Engineering', url: 'https://www.youtube.com/watch?v=s5MJpRBQLgo&list=PLTV_nsuD2lf7JOwZdSWuup-YO0AUaDQti' },
      { id: 'c_machine_learning', category: 'Machine Learning', url: 'https://www.youtube.com/watch?v=1L420xXpDTg&list=PLaldQ9PzZd9qT0KsKJ7yCq70iFFP3MFJ5' },
      { id: 'c_ai', category: 'Artificial Intelligence', url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU' },
      { id: 'c_data_science', category: 'Data Science', url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU' },
      { id: 'c_web_dev', category: 'Web Development', url: 'https://www.youtube.com/watch?v=9tbaiFIm0HU' }
    ];

    expectedTracks.forEach(expected => {
      const course = OFFICIAL_COURSES.find(c => c.id === expected.id);
      expect(course).toBeDefined();
      expect(course?.category).toBe(expected.category);
      expect(course?.referenceUrl).toBe(expected.url);

      const catalogCourse = courseCatalogService.getCourseById(expected.id);
      expect(catalogCourse).toBeDefined();
      expect(catalogCourse?.category).toBe(expected.category);
      expect(catalogCourse?.url).toBe(expected.url);
    });
  });

  describe('YouTube Parsing & Embedder Logic', () => {
    it('correctly extracts video ID and preserves playlist parameter', () => {
      const parsed = parseYouTubeUrl('https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH');
      expect(parsed).not.toBeNull();
      expect(parsed?.videoId).toBe('T55Kb8rrH1g');
      expect(parsed?.playlistId).toBe('PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH');
      expect(parsed?.embedUrl).toContain('https://www.youtube-nocookie.com/embed/T55Kb8rrH1g?list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH');
    });

    it('correctly parses standalone video without playlist', () => {
      const parsed = parseYouTubeUrl('https://www.youtube.com/watch?v=9tbaiFIm0HU');
      expect(parsed).not.toBeNull();
      expect(parsed?.videoId).toBe('9tbaiFIm0HU');
      expect(parsed?.playlistId).toBeUndefined();
      expect(parsed?.embedUrl).toContain('https://www.youtube-nocookie.com/embed/9tbaiFIm0HU');
    });

    it('returns null for non-YouTube strings', () => {
      expect(parseYouTubeUrl('https://example.com/video.mp4')).toBeNull();
      expect(parseYouTubeUrl('')).toBeNull();
      expect(parseYouTubeUrl(undefined)).toBeNull();
    });
  });

  describe('Catalog Category Filtering & Deduplication', () => {
    it('returns all 13 categories plus All', () => {
      const categories = courseCatalogService.getCategories();
      expect(categories).toContain('All');
      expect(categories).toContain('Frontend');
      expect(categories).toContain('Backend');
      expect(categories).toContain('MERN Stack');
      expect(categories).toContain('MEAN Stack');
      expect(categories).toContain('Data Structures and Algorithms (DSA)');
      expect(categories).toContain('Java');
      expect(categories).toContain('Python');
      expect(categories).toContain('Data Analytics');
      expect(categories).toContain('Data Engineering');
      expect(categories).toContain('Machine Learning');
      expect(categories).toContain('Artificial Intelligence');
      expect(categories).toContain('Data Science');
      expect(categories).toContain('Web Development');
    });

    it('filters courses by category correctly', () => {
      const dsaCourses = courseCatalogService.filterCourses({ category: 'Data Structures and Algorithms (DSA)' });
      expect(dsaCourses.length).toBe(1);
      expect(dsaCourses[0].code).toBe('DSA-201');

      const frontendCourses = courseCatalogService.filterCourses({ category: 'Frontend' });
      expect(frontendCourses.length).toBe(1);
      expect(frontendCourses[0].code).toBe('FE-101');
    });

    it('searches courses across title and keywords', () => {
      const pythonSearch = courseCatalogService.filterCourses({ query: 'python' });
      expect(pythonSearch.length).toBeGreaterThanOrEqual(1);
      expect(pythonSearch.some(c => c.id === 'c_python')).toBe(true);
    });
  });
});
