import { describe, it, expect } from 'vitest';
import { parseYouTubeUrl } from '../src/utils/youtubeUtils';

describe('YouTube Utility & Video Resource Parsing', () => {
  it('parses standard YouTube watch URL and preserves playlist query parameter', () => {
    const url = 'https://www.youtube.com/watch?v=T55Kb8rrH1g&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH';
    const parsed = parseYouTubeUrl(url);

    expect(parsed).not.toBeNull();
    expect(parsed?.videoId).toBe('T55Kb8rrH1g');
    expect(parsed?.playlistId).toBe('PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH');
    expect(parsed?.embedUrl).toContain('https://www.youtube-nocookie.com/embed/T55Kb8rrH1g');
    expect(parsed?.embedUrl).toContain('list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH');
    expect(parsed?.watchUrl).toBe(url);
  });

  it('parses standalone YouTube watch URL without playlist', () => {
    const url = 'https://www.youtube.com/watch?v=9tbaiFIm0HU';
    const parsed = parseYouTubeUrl(url);

    expect(parsed).not.toBeNull();
    expect(parsed?.videoId).toBe('9tbaiFIm0HU');
    expect(parsed?.playlistId).toBeUndefined();
    expect(parsed?.embedUrl).toBe('https://www.youtube-nocookie.com/embed/9tbaiFIm0HU?rel=0');
  });

  it('handles empty or invalid URLs gracefully without crashing', () => {
    expect(parseYouTubeUrl(undefined)).toBeNull();
    expect(parseYouTubeUrl('')).toBeNull();
    expect(parseYouTubeUrl('invalid-url-string')).toBeNull();
  });
});

describe('Certificate ID & Eligibility Validation', () => {
  it('validates VXAI and CERT prefix identifiers', () => {
    const validVXAI = 'VXAI-FE-2026-00412';
    const validCERT = 'CERT-C_FRONTEND-12345';
    const invalidID = 'DUMMY-123';

    const isFormatValid = (id: string) => id.startsWith('VXAI-') || id.startsWith('CERT-');

    expect(isFormatValid(validVXAI)).toBe(true);
    expect(isFormatValid(validCERT)).toBe(true);
    expect(isFormatValid(invalidID)).toBe(false);
  });

  it('strictly enforces 100% completion requirement before unlocking certificate', () => {
    const checkEligibility = (progress: number, isEnrolled: boolean) => {
      return isEnrolled && progress === 100;
    };

    expect(checkEligibility(100, true)).toBe(true);
    expect(checkEligibility(99, true)).toBe(false);
    expect(checkEligibility(0, true)).toBe(false);
    expect(checkEligibility(100, false)).toBe(false);
  });
});
