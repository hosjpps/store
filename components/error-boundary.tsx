"use client"

import { Component, type ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Произошла ошибка
              </h1>
              <p className="text-muted-foreground">
                Что-то пошло не так
              </p>
            </div>
            <Button
              onClick={() => this.setState({ hasError: false })}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Попробовать снова
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
