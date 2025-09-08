import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './index';

describe('Pagination Component', () => {
  it('should disable the "Previous" button on the first page', () => {
    render(
      <Pagination 
        paginaAtual={0} 
        totalPaginas={10} 
        onPageChange={() => {}} 
      />
    );

    const previousButton = screen.getByText('Anterior');
    expect(previousButton).toBeDisabled();
  });

  it('should disable the "Next" button on the last page', () => {
    render(
      <Pagination 
        paginaAtual={9} 
        totalPaginas={10} 
        onPageChange={() => {}} 
      />
    );

    const nextButton = screen.getByText('Próximo');
    expect(nextButton).toBeDisabled();
  });
});