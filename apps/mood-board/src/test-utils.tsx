import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
    const queryClient = new QueryClient()
  
    const Wrapper: React.FC = (props: any) => (
      <QueryClientProvider client={queryClient}>
            {props.children}
      </QueryClientProvider>
    )
  
    return render(ui, { wrapper: Wrapper, ...options })
  }

export * from '@testing-library/react' 

export { customRender as render } 
