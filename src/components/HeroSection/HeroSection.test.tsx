import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSection from './index';

// Mock do componente SearchForm para isolar o teste
vi.mock('../SearchForm', () => ({
  // A função default exporta um componente falso que renderiza um texto
  default: ({ onSearch }: { onSearch: Function }) => (
    <form data-testid="search-form" onSubmit={() => onSearch({ mock: true })}>
      Mock Search Form
    </form>
  ),
}));

describe('HeroSection Component', () => {
  it('should not show the search form initially', () => {
    // 1. Arrange: Renderizamos o componente
    render(<HeroSection onSearch={() => {}} />);

    // 2. Assert: Verificamos se o formulário NÃO está na tela
    // Usamos queryByTestId porque ele não dá erro se não encontrar o elemento
    const form = screen.queryByTestId('search-form');
    expect(form).not.toBeInTheDocument();
  });

  it('should show the search form after clicking the toggle button', () => {
    // 1. Arrange
    render(<HeroSection onSearch={() => {}} />);

    // 2. Act: Encontramos o botão e simulamos o clique
    const toggleButton = screen.getByText('Abrir Filtros de Busca');
    fireEvent.click(toggleButton);

    // 3. Assert: Agora, verificamos se o formulário APARECEU na tela
    const form = screen.getByTestId('search-form');
    expect(form).toBeInTheDocument();

    // Verificação extra: o texto do botão mudou?
    expect(screen.getByText('Fechar Filtros')).toBeInTheDocument();
  });
});